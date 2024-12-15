import logging

import requests
from django.contrib.auth.hashers import check_password, make_password
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Test, TestResult, User
from .serializers import TestResultSerializer, TestSerializer, UserSerializer

logger = logging.getLogger(__name__)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

class TestResultViewSet(viewsets.ModelViewSet):
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer


@api_view(['GET'])
def generate_image(request):
    """
    Generate an image using Pollinations.AI
    """
    params = request.query_params
    prompt = params.get('prompt')  # Use .get() to avoid KeyError

    if not prompt:
        return Response({"message": "Error: Prompt is required"}, status=400)

    base_url = "https://image.pollinations.ai/prompt/"
    style = " in a cute style"
    url = f"{base_url}{prompt}{style}&nologo=false&model=turbo"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            return Response({"image_url": response.url})
        else:
            return Response({"message": "Error: Failed to generate image"}, status=response.status_code)
    except Exception as e:
        return Response({"message": str(e)}, status=500)


@api_view(['POST'])
def signup(request):
    """
    Handle user signup by creating a new user in the database.
    Input: 
    {
        "account": "test_user", 
        "password": "password123", 
        "username": "Test User"
    }
    Output:
    {
        "success":true,
        "message":"Signup successful.",
        "user_id":"some_user_id",
    }
    """
    data = request.data
    account = data.get('account')
    password = data.get('password')
    username = data.get('username')

    if not account or not password or not username:
        return Response({"success": False, "message": "Error: All fields are required."}, status=400)

    if User.objects.filter(account=account).exists():
        return Response({"success": False, "message": "Error: Account already exists."}, status=400)

    hashed_password = make_password(password)
    user = User.objects.create(
        account=account,
        username=username,
        password=hashed_password,
    )
    user_id = str(user.user_id)
    return Response({
                    "success": True, 
                    "message": "Signup successful.",
                    "user_id": user_id,
                    }, status=201)


@api_view(['GET'])
def login(request):
    """
    Handle user login by validating credentials.
    Input: 
    {
        "account": "test_user", 
        "password": "password123", 
    }
    Output:
    {
        "success":true,
        "message":"Login successful."
    }
    """
    data = request.query_params
    account = data['account']
    password = data['password']

    if not account or not password:
        return Response({"success": False, "message": "Error: All fields are required."}, status=400)

    try:
        user = User.objects.get(account=account)
        if check_password(password, user.password):
            serializer = UserSerializer(user)  # 使用 UserSerializer 序列化使用者資料
            return Response({
                "success": True,
                "message": "Login successful.",
                "user": serializer.data,  # 序列化後的使用者資料
            }, status=200)
        else:
            return Response({"success": False, "message": "Error: Invalid password."}, status=401)
    except User.DoesNotExist:
        return Response({"success": False, "message": "Error: Account does not exist."}, status=404)


@api_view(['POST'])
def saveTest(request):
    """
    Save a test to the database.
    Input:
    {
        "title": "Sample Test",
        "questions": ["QQ1"],
        "results": ["RES1"],
        "backgroundImage": "http://example.com/image.jpg",
        "user_id": "user456"
    }
    """
    data = request.data
    title = data.get('title')
    user_id = data.get('userId')
    questions = data.get('questions')
    results = data.get('results')
    backgroundImage = data.get('backgroundImage')

    if not (user_id and title and questions and results):
        return Response({"success": False, "message": "Error: All fields are required."}, status=400)

    test = Test.objects.create(
        title=title,
        user_id=user_id,
        questions=questions,
        results=results,
        backgroundImage=backgroundImage,
    )
    
    return Response({
                    "success": True, 
                    "message": "Test saved successfully.",
                    "testId":str(test.test_id),
                    }, status=200)


@api_view(['POST'])
def deleteTest(request):
    """
    Delete a test from the database by test ID.
    """
    data = request.data  # Use request.data for POST requests
    test_id = data.get('testId')
    if not test_id:
        return Response({"success": False, "message": "Error: Test ID is required."}, status=400)

    try:
        test = Test.objects.get(test_id=test_id)
        results = TestResult.objects.filter(test_id=test_id)
        deleted_results_count = results.delete()
        test.delete()
        return Response({"success": True, "message": f"Test and {deleted_results_count} related results are deleted successfully."}, status=200)
    except Test.DoesNotExist:
        return Response({"success": False, "message": "Error: Test not found."}, status=404)


@api_view(['GET'])
def getAllTests(request):
    """
    Fetch all saved tests.
    """
    tests = Test.objects.all()
    data = [
        {
            "testId": test.test_id,
            "title": test.title,
            "userId": test.user_id,
            "questions": test.questions,
            "results": test.results,
            "backgroundImage": test.backgroundImage,
        }
        for test in tests
    ]
    return Response({"success": True, 
        "message": "Get all tests successfully", 
        "allTests": data
    }, status=200)


@api_view(['GET'])
def getUserTests(request):
    """
    Fetch all saved tests from user.
    Input:
    {
        "userId": userid,
    }
    """
    data = request.query_params  # Use request.data for POST requests
    user_id = data.get('userId')
    results = Test.objects.filter(user_id=user_id)
    if not results.exists():
        return Response({"success": True, "message": "No User Test Exists", "userTests": []}, status=200)

    data = [
        {
            "testId": test.test_id,
            "title": test.title,
            "userId": test.user_id,
            "questions": test.questions,
            "results": test.results,
            "backgroundImage": test.backgroundImage,
        }
        for test in results
    ]
    return Response({
        "success": True, 
        "message": "Get user tests successfully", 
        "userTests": data
    }, status=200)


@api_view(['GET'])
def getTestById(request):
    """
    Fetch a test by its ID.
    Input:
    {   
        "test_id": "test123"
    }
    """
    test_id = request.query_params.get('testId')
    test = get_object_or_404(Test, test_id=test_id)
    data = {
        "testId": test.test_id,
        "title": test.title,
        "userId": test.user_id,
        "questions": test.questions,
        "results": test.results,
        "backgroundImage": test.backgroundImage,
    }
    return Response({
        "success": True,
        "message": f"Get test by id {test_id} successfully",
        "test": data
    }, status=200)


@api_view(['POST'])
def saveTestResult(request):
    """
    Save user test results.
    Input:
    {
        "result_id"
        "testId": "test123",
        "userId": "user456",
        "answers": {'0': 0, '1': 0},
        "resultIndex": 0
    }
    """
    data = request.data
    test_id = data.get('testId')
    user_id = data.get('userId')
    answers = data.get('answers')
    result_index = data.get('resultIndex')

    if not (test_id and user_id and answers and result_index is not None):
        return Response({"success": False, "message": "Error: All fields are required."}, status=400)

    TestResult.objects.create(
        test_id=test_id,
        user_id=user_id,
        answers=answers,
        result_index=result_index,
        date=timezone.now(),
    )
    return Response({"success": True, "message": "Result saved successfully."}, status=200)


@api_view(['GET'])
def getUserResults(request):
    """
    Retrieve all results for a specific user.
    Input:
    {
        "userId": "user456"
    }
    """
    user_id = request.query_params.get('userId')
    results = TestResult.objects.filter(user_id=user_id)
    if not results.exists():
        return Response({
            "success": False, 
            "message": "No user result exists", 
            "userResults": []
        }, status=200)

    data = [
        {
            "resultId": result.result_id,
            "testId": result.test_id,
            "resultIndex": result.result_index,
            "answers": result.answers,
            "date": result.date,
        }
        for result in results
    ]
    return Response({
        "success": True, 
        "message": "Get user results successfully",
        "userResults": data,
    }, status=200)


@api_view(['PUT'])
def updateTest(request):
    """
    Update an existing test.
    
    Input Testing:
    {
        "test_id": "test123",
        "title": "Sample Test",
        "questions": ["Update test 1"],
        "results": ["Result 1"],
        "backgroundImage": "http://example.com/image.jpg",
        "user_id": "user456"
    }
    Output:
    {
        "test_id":"test123",
        "title":"Sample Test",
        "questions":["Update test 2"],
        "results":["Result 1"],
        "backgroundImage":"http://example.com/image.jpg",
        "user_id":"user456"
    }
    """
    data = request.data
    test_id = data.get('test_id')

    try:
        test = Test.objects.get(test_id=test_id)
        test.title = data.get('title', test.title)
        test.questions = data.get('questions', test.questions)
        test.results = data.get('results', test.results)
        test.backgroundImage = data.get('backgroundImage', test.backgroundImage)
        test.save()
        data = {
            "test_id": test.test_id,
            "title": test.title,
            "questions": test.questions,
            "results": test.results,
            "backgroundImage": test.backgroundImage,
            # "createdAt": test.createdAt,
            "user_id": test.user_id,
        }
        return Response({"data": data}, status=200)
    except Test.DoesNotExist:
        return Response({"message": "Error: Test not found."}, status=404)


@api_view(['DELETE'])
def deleteResult(request):
    """
    Delete a user's test result.
    Input:
    { 
        "result_id": "Binary.createFromBase64('HqOWR8l0QIiOBnWUp7Md7w==', 3)",
    }
    """
    data = request.data
    result_id = data.get('resultId')    
    try:
        result = TestResult.objects.get(result_id=result_id)
        result.delete()
        return Response({'success': True, 'message': 'Result deleted successfully'}, status=200)
    except TestResult.DoesNotExist:
        logger.error(f'TestResult with result_id {result_id} not found.')
        return Response({'success': False, 'message': 'Error: TestResult not found'}, status=404)
    except Exception as e:
        logger.error(f'Error deleting TestResult: {str(e)}')
        return Response({'success': False, 'message': 'Error: An error occurred during deletion'}, status=500)
