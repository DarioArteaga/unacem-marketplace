from fastapi import APIRouter

from app.api.deps import CoachOrAdmin
from app.schemas.assist import AssistRequest, AssistSuggestion
from app.services.assist import suggest_from_text

router = APIRouter(prefix="/admin")


@router.post("/assist", response_model=AssistSuggestion)
def assist(body: AssistRequest, _: CoachOrAdmin) -> AssistSuggestion:
    return suggest_from_text(body.texto)
