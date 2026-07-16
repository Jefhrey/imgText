from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from ocr.serializers import UserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def checkLog(request):
    # if session cookie is found, the user is logged in.
    if request.user.is_authenticated:
        return Response({"isLoggedIn": True})
    else: 
        return Response({"isLoggedIn": False})
    

@api_view(['POST'])
def logIn(request):
    username = request.data["username"]
    password = request.data["password"]

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return Response({"message": "Authentication successful."}, status=200)

    else:
        return Response({"message": "Invalid credentials. Please try again"}, status=401)


@api_view(['GET'])
def logOut(request):
    logout(request)
    return Response({"message": "Logged out successfully"}, status = 200)

