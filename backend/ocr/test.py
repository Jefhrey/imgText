from rest_framework.test import APIClient, APITestCase
from .models import User
from rest_framework import status
"""
Views to test:
1. get_csrf
2. sign_up
3. checkLog
4. logIn
5. logOut
"""

class AuthTests(APITestCase):
    def setUp(self):
        self.client = APIClient(enforce_csrf_checks=True)
        self.password = "alicepassword"
        self.user = User.objects.create_user(
            username="Alice",
            password=self.password
        )

    def get_csrf(self):
        self.client.get("/csrf/")



class CsrfTests(AuthTests):
    def test_csrf(self):
        response = self.client.get("/csrf/")
        self.assertTrue(status.is_success(response.status_code))
        self.assertIn("csrftoken", self.client.cookies)

class SignupTests(AuthTests):
    def test_valid_signup(self):
        # also includes check for checkLog
        self.get_csrf()
        check1 = self.client.get("/checklog/")

        self.assertFalse(check1.data["isLoggedIn"])

        response = self.client.post(
                    "/signup/", 
                    {
                        "username": "Bob",
                        "password": "bobpassword123"
                    },
                    format="json",
                    headers={
                        "X-CSRFToken": self.client.cookies["csrftoken"].value
                    } )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        check2 = self.client.get("/checklog/")
        self.assertTrue(check2.data["isLoggedIn"])

    def test_missing_username(self):
        self.get_csrf()
        response = self.client.post(
                    "/signup/", 
                    {
                        "username": "",
                        "password": "bobpassword123"
                    },
                    format="json",
                    headers={
                        "X-CSRFToken": self.client.cookies["csrftoken"].value
                    } )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_password(self):
        self.get_csrf()
        response = self.client.post(
                    "/signup/", 
                    {
                        "username": "alice",
                        "password": ""
                    },
                    format="json",
                    headers={
                        "X-CSRFToken": self.client.cookies["csrftoken"].value
                    } )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duplicate_signup(self):
        self.get_csrf()
        response = self.client.post(
                    "/signup/", 
                    {
                        "username": "Alice",
                        "password": "alicepassword"
                    },
                    format="json",
                    headers={
                        "X-CSRFToken": self.client.cookies["csrftoken"].value
                    } )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTests(AuthTests):
    def test_valid_login(self):
        self.get_csrf()
        response = self.client.post(
                    "/login/", 
                    {
                        "username": "Alice",
                        "password": "alicepassword"
                    },
                    format="json",
                    headers={
                        "X-CSRFToken": self.client.cookies["csrftoken"].value
                    } )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_username(self):
        self.get_csrf()
        response = self.client.post(
                    "/login/", 
                    {
                        "username": "Bob",
                        "password": "bobpassword123"
                    },
                    format="json",
                    headers={
                        "X-CSRFToken": self.client.cookies["csrftoken"].value
                    } )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_invalid_password(self):
        self.get_csrf()
        response = self.client.post(
                    "/login/", 
                    {
                        "username": "Alice",
                        "password": "bobpassword"
                    },
                    format="json",
                    headers={
                        "X-CSRFToken": self.client.cookies["csrftoken"].value
                    } )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout(self):
        self.get_csrf()
        # Login first 

        # login_response = self.client.post(
        #     "/login/",
        #     {
        #         "username": "Alice",
        #         "password": "alicepassword"
        #     },
        #     format="json",
        #     headers={"X-CSRFToken": self.client.cookies["csrftoken"].value}
        # )

        # self.assertEqual(login_response.status_code, status.HTTP_200_OK)

        self.client.force_login(self.user)
        
        response = self.client.post(
            "/logout/",
            headers=
            {
                "X-CSRFToken": self.client.cookies["csrftoken"].value
            })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        check = self.client.get("/checklog/")
        self.assertFalse(check.data["isLoggedIn"])
        
 
       