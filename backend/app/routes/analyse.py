from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.nlp import analyse_article

class AnalyseRequestModel(BaseModel):
    url: str

router = APIRouter(prefix="/analyse", tags=["Analyse"])

@router.post("/")
async def analyse(request: AnalyseRequestModel):
    try:
        result = await analyse_article(request.url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))