from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'items', views.ItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('test/', views.test_api, name='test-api'),
    path('generate_image/', views.generate_image, name='generate_image'),
]
