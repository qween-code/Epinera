"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-04-28 00:00:00

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from pgvector.sqlalchemy import Vector

revision: str = "0001_initial"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


SEVERITY_VALUES = ("info", "low", "medium", "high", "critical")
STATUS_VALUES = (
    "detected",
    "analyzing",
    "awaiting_action",
    "in_progress",
    "resolved",
    "closed",
)
CHAT_ROLE_VALUES = ("user", "assistant", "system")
ACTION_TYPE_VALUES = ("promanage_inplace", "email", "ticket", "note")
ACTION_STATUS_VALUES = (
    "proposed",
    "approved",
    "executing",
    "succeeded",
    "failed",
    "skipped",
)


def _str_enum(values: tuple[str, ...], name: str) -> sa.Enum:
    return sa.Enum(*values, name=name, native_enum=False, length=32)


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        "knowledge_entries",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("problem", sa.Text(), nullable=False),
        sa.Column("root_cause", sa.Text()),
        sa.Column("resolution", sa.Text()),
        sa.Column("actors", sa.JSON()),
        sa.Column("duration_minutes", sa.Integer()),
        sa.Column("tags", sa.JSON()),
        sa.Column("system", sa.String(50)),
        sa.Column("embedding", Vector(1024)),
    )

    op.create_table(
        "incidents",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("source", sa.String(50), nullable=False),
        sa.Column(
            "severity",
            _str_enum(SEVERITY_VALUES, "incidentseverity"),
            nullable=False,
            server_default="info",
        ),
        sa.Column(
            "status",
            _str_enum(STATUS_VALUES, "incidentstatus"),
            nullable=False,
            server_default="detected",
        ),
        sa.Column("summary", sa.Text()),
        sa.Column("root_cause", sa.Text()),
        sa.Column("resolution", sa.Text()),
        sa.Column("resolver", sa.String(120)),
        sa.Column("resolved_at", sa.DateTime(timezone=True)),
        sa.Column("raw_payload", sa.JSON()),
        sa.Column("tags", sa.JSON()),
        sa.Column(
            "knowledge_entry_id",
            sa.UUID(),
            sa.ForeignKey("knowledge_entries.id"),
        ),
    )

    op.create_table(
        "log_events",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("source", sa.String(50), nullable=False),
        sa.Column("stream", sa.String(120)),
        sa.Column("severity", sa.String(20)),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("observed_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("fingerprint", sa.String(64)),
        sa.Column("extra", sa.JSON()),
        sa.Column("incident_id", sa.UUID(), sa.ForeignKey("incidents.id")),
    )
    op.create_index("ix_log_events_source_observed", "log_events", ["source", "observed_at"])
    op.create_index("ix_log_events_severity", "log_events", ["severity"])

    op.create_table(
        "file_assets",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("incident_id", sa.UUID(), sa.ForeignKey("incidents.id")),
        sa.Column("filename", sa.String(300), nullable=False),
        sa.Column("content_type", sa.String(120), nullable=False),
        sa.Column("size_bytes", sa.Integer(), nullable=False),
        sa.Column("storage_path", sa.String(500), nullable=False),
        sa.Column("sha256", sa.String(64)),
        sa.Column("extracted_text", sa.Text()),
        sa.Column("analysis", sa.JSON()),
    )

    op.create_table(
        "chat_messages",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("incident_id", sa.UUID(), sa.ForeignKey("incidents.id")),
        sa.Column(
            "role",
            _str_enum(CHAT_ROLE_VALUES, "chatrole"),
            nullable=False,
        ),
        sa.Column("content", sa.Text(), nullable=False),
    )

    op.create_table(
        "actions",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("incident_id", sa.UUID(), sa.ForeignKey("incidents.id"), nullable=False),
        sa.Column(
            "type",
            _str_enum(ACTION_TYPE_VALUES, "actiontype"),
            nullable=False,
        ),
        sa.Column(
            "status",
            _str_enum(ACTION_STATUS_VALUES, "actionstatus"),
            nullable=False,
            server_default="proposed",
        ),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("payload", sa.JSON()),
        sa.Column("result", sa.JSON()),
        sa.Column("requires_approval", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("executed_at", sa.DateTime(timezone=True)),
    )


def downgrade() -> None:
    op.drop_table("actions")
    op.drop_table("chat_messages")
    op.drop_table("file_assets")
    op.drop_index("ix_log_events_severity", table_name="log_events")
    op.drop_index("ix_log_events_source_observed", table_name="log_events")
    op.drop_table("log_events")
    op.drop_table("incidents")
    op.drop_table("knowledge_entries")
