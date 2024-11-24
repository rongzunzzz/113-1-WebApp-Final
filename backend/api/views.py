from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Item
from .serializers import ItemSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

@api_view(['GET'])
def test_api(request):
    params = request.query_params
    print(params)

    param1 = params['param1']
    print(param1)

    param_list = params.getlist('paramList')
    print(param_list)

    return Response({"message": f"API is working! We get {param1} and {param_list}"})
