import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Item, User, Test
from .serializers import ItemSerializer, UserSerializer, TestSerializer
from django.contrib.auth.hashers import make_password, check_password

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

@api_view(['GET'])
def generate_image(request):
    """
    Generate an image using Pollinations.AI
    """

    params = request.query_params
    prompt = params['prompt']

    base_url = "https://image.pollinations.ai/prompt/"
    style = "in a cute cartoon style"

    if not prompt:
        return Response({"error": "Prompt is required"}, status=400)

    # Construct the request URL
    url = f"{base_url}{prompt}{style}"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            return Response({"image_url": response.url})
        else:
            return Response({"error": "Failed to generate image"}, status=response.status_code)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def test_api(request):
    params = request.query_params
    print(params)

    param1 = params['param1']
    print(param1)

    param_list = params.getlist('paramList')
    print(param_list)

    return Response({"message": f"API is working! We get {param1} and {param_list}"})

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
        "message":"Signup successful."
    }
    """
    params = request.query_params
    account = params['account']
    password = params['password']
    username = params['username']

    if not account or not password or not username:
        return Response({"success": False, "error": "All fields are required."}, status=400)

    if User.objects.filter(account=account).exists():
        return Response({"success": False, "error": "Account already exists."}, status=400)

    hashed_password = make_password(password)
    user = User.objects.create(account=account, username=username, password=hashed_password)
    return Response({"success": True, "message": "Signup successful."}, status=201)

@api_view(['POST'])
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
    params = request.query_params
    account = params['account']
    password = params['password']

    if not account or not password:
        return Response({"success": False, "error": "All fields are required."}, status=400)

    try:
        user = User.objects.get(account=account)
        if check_password(password, user.password):
            return Response({"success": True, "message": "Login successful."}, status=200)
        else:
            return Response({"success": False, "error": "Invalid password."}, status=401)
    except User.DoesNotExist:
        return Response({"success": False, "error": "Account does not exist."}, status=404)

@api_view(['POST'])
def saveTest(request):
    """
    Save a test to the database.
    Input:
    {
        "test_id": "test123",
        "test_content": "This is a test content", 
        "user_id": "user456"
    }
    Output:
    {   
        "success":true, 
        "message":"Test saved successfully."
    }
    """
    params = request.query_params
    test_id = params['test_id']
    test_content = params['test_content']
    user_id = params['user_id']

    # Validate input
    if not test_id or not test_content or not user_id:
        return Response({"success": False, "error": "All fields are required."}, status=400)

    # Save the test to the database
    test = Test.objects.create(
        test_id=test_id,
        test_content=test_content,
        user_id=user_id
    )

    return Response({"success": True, "message": "Test saved successfully."}, status=201)

@api_view(['POST'])
def deleteTest(request):
    """
    Delete a test from the database by test ID.
    Input:
    {
        "test_id": "test123"
    }
    """
    params = request.query_params
    test_id = params['test_id']

    # Validate input
    if not test_id:
        return Response({"success": False, "error": "Test ID is required."}, status=400)

    try:
        # Find and delete the test
        test = Test.objects.get(test_id=test_id)
        test.delete()
        return Response({"success": True, "message": "Test deleted successfully."}, status=200)
    except Test.DoesNotExist:
        return Response({"success": False, "error": "Test not found."}, status=404)
