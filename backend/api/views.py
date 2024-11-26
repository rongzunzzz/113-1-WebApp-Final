import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Item
from .serializers import ItemSerializer

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