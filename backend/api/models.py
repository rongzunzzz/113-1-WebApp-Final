from django.db import models


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
    test_id = models.CharField(max_length=100, unique=True)
    test_content = models.TextField()
    user_id = models.CharField(max_length=100)

    def __str__(self):
        return self.test_id