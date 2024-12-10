from django.db import models
import uuid

# Create your models here.
class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class User(models.Model):
    username = models.CharField(max_length=255, unique=True)
    account = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)  # Store hashed passwords
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'User' 
        

class Test(models.Model):
    # test_id = models.CharField(max_length=100, unique=True) 
    test_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255) 
    user_id = models.CharField(max_length=100) 
    questions = models.JSONField() 
    results = models.JSONField() 
    backgroundImage = models.TextField(null=True, blank=True) 

    def __str__(self):
        return self.title



class TestResult(models.Model):
    # result_id = models.CharField(max_length=100, unique=True) 
    result_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=255)
    test_id = models.CharField(max_length=255)
    answers = models.JSONField() 
    result_index = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Result for test {self.test_id} by user {self.user_id}"