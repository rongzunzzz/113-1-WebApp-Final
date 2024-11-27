import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Item, User
from .serializers import ItemSerializer, UserSerializer
from django.contrib.auth.hashers import make_password, check_password

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

@api_view(['GET'])
def generate_image(request):
    """
    Generate an image using Pollinations.AI
    """
    base_url = "https://image.pollinations.ai/prompt/"
    prompt = request.query_params.get('prompt', None)
    model = request.query_params.get('model', 'flux')  # Default model: 'flux'

    if not prompt:
        return Response({"error": "Prompt is required"}, status=400)

    # Construct the request URL
    url = f"{base_url}{prompt}"
    params = {"model": model}

    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return Response({"image_url": response.url})
        else:
            return Response({"error": "Failed to generate image"}, status=response.status_code)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def test_api(request):
    """
    Test the generate_image API functionality.
    """
    # Simulate parameters for image generation
    test_prompt = "sunset"
    test_model = "flux"

    # Call the Pollinations.AI image generation API
    base_url = "https://image.pollinations.ai/prompt/"
    url = f"{base_url}{test_prompt}"
    params = {"model": test_model}

    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            image_url = response.url
            return Response({
                "message": "Generate Image API is working!",
                "image_url": image_url,
            })
        else:
            return Response({
                "error": "Generate Image API failed",
                "status_code": response.status_code,
                "details": response.json(),
            }, status=response.status_code)
    except Exception as e:
        return Response({"error": str(e)}, status=500)



@api_view(['POST'])
def signup(request):
    """
    Handle user signup by creating a new user in the database.
    """
    account = request.data.get('account')
    password = request.data.get('password')
    username = request.data.get('username')

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
    """
    account = request.data.get('account')
    password = request.data.get('password')

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
