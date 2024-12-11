from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'tests', views.TestViewSet)
router.register(r'test-results', views.TestResultViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('test/', views.test_api, name='test-api'),
    path('generate_image/', views.generate_image, name='generate_image'),
    path('login/', views.login, name='login'),
    path('signup/', views.signup, name='signup'),
    path('saveTest/', views.saveTest, name='saveTest'),
    path('deleteTest/', views.deleteTest, name='deleteTest'),
    path('getAllTests/', views.getAllTests, name='getAllTests'),
    path('getTestById/', views.getTestById, name='getTestById'),
    path('saveTestResult/', views.saveTestResult, name='saveTestResult'),
    path('getUserResults/', views.getUserResults, name='getUserResults'),
    path('updateTest/', views.updateTest, name='updateTest'),
    path('deleteTestResult/', views.deleteTestResult, name='deleteTestResult'),
    path('getUserTests/', views.getUserTests, name='getUserTests'),
]
