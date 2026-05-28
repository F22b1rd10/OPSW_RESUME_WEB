from typing import Any, Generic, TypeVar
from pydantic import BaseModel
from pydantic.generics import GenericModel

DataT = TypeVar("DataT")

class ApiResponse(GenericModel, Generic[DataT]):
    success: bool = True
    message: str = "Success"
    data: DataT | None = None

class ErrorResponse(BaseModel):
    success: bool = False
    message: str = "Error"
    detail: Any | None = None
