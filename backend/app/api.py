from app.auth_validation import validate_auth_payload
from common.errors import RequestErrorCode, build_error
from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def api_health_check(request):
    return Response({"status": "ok", "service": "api"})


@api_view(["POST"])
def register_validation(request):
    try:
        payload = request.data
    except ParseError:
        return _invalid_json_body_response()

    if not isinstance(payload, dict):
        return _invalid_json_body_response()

    result = validate_auth_payload(payload.get("email"), payload.get("password"))
    response_status = status.HTTP_200_OK if result["is_valid"] else status.HTTP_400_BAD_REQUEST
    return Response(result, status=response_status)


def _invalid_json_body_response():
    return Response(
        {
            "is_valid": False,
            "errors": [build_error("general", RequestErrorCode.INVALID_JSON_BODY)],
            "normalized": {},
        },
        status=status.HTTP_400_BAD_REQUEST,
    )
