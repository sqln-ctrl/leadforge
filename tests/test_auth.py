def test_register_creates_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "shah@example.com", "password": "supersecret123", "full_name": "Shah"},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["email"] == "shah@example.com"
    assert body["role"] == "viewer"  # self-registration always lands as viewer
    assert "hashed_password" not in body  # never leak the hash


def test_register_duplicate_email_rejected(client):
    payload = {"email": "dupe@example.com", "password": "supersecret123"}
    client.post("/api/v1/auth/register", json=payload)
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 400


def test_login_returns_token(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "login@example.com", "password": "supersecret123"},
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "login@example.com", "password": "supersecret123"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"


def test_login_wrong_password_rejected(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "wrongpw@example.com", "password": "supersecret123"},
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "wrongpw@example.com", "password": "not-the-password"},
    )
    assert response.status_code == 401


def test_protected_route_requires_token(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_protected_route_works_with_token(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "protected@example.com", "password": "supersecret123"},
    )
    login_response = client.post(
        "/api/v1/auth/login",
        data={"username": "protected@example.com", "password": "supersecret123"},
    )
    token = login_response.json()["access_token"]

    response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "protected@example.com"
