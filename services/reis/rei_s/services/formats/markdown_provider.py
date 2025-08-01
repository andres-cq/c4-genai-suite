from typing import Any
from langchain_core.documents import Document
from langchain_text_splitters import MarkdownTextSplitter

from rei_s.services.formats.abstract_format_provider import AbstractFormatProvider
from rei_s.services.formats.utils import validate_chunk_overlap, validate_chunk_size
from rei_s.types.source_file import SourceFile


class MarkdownProvider(AbstractFormatProvider):
    name = "markdown"

    file_name_extensions = [".md"]

    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 0, **_kwargs: Any) -> None:
        super().__init__()
        self.default_chunk_size = chunk_size
        self.default_chunk_overlap = chunk_overlap

    def splitter(self, chunk_size: int | None = None, chunk_overlap: int | None = None) -> MarkdownTextSplitter:
        chunk_size = validate_chunk_size(chunk_size, self.default_chunk_size)
        chunk_overlap = validate_chunk_overlap(chunk_overlap, self.default_chunk_overlap)
        return MarkdownTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)

    def process_file(
        self, file: SourceFile, chunk_size: int | None = None, chunk_overlap: int | None = None
    ) -> list[Document]:
        text = file.buffer.decode()

        chunks = self.splitter(chunk_size, chunk_overlap).create_documents([text])
        return chunks
