-- Пример: V1__init_washapp_schema.sql
-- Инициализация схемы БД для WashApp

-- На всякий случай можно задать схемy (если используете не public)
-- CREATE SCHEMA IF NOT EXISTS washapp;
-- SET search_path TO washapp;

------------------------------------------------------------
-- Таблица пользователей
------------------------------------------------------------
CREATE TABLE users (
    id           BIGSERIAL PRIMARY KEY,
    email        VARCHAR(320) NOT NULL UNIQUE,
    password     TEXT NOT NULL,
    role         VARCHAR(50) NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Учитывая частый логин по email
CREATE INDEX idx_users_email ON users (email);

------------------------------------------------------------
-- Таблица автомоек
------------------------------------------------------------
CREATE TABLE car_wash (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    address     VARCHAR(300) NOT NULL,
    latitude    DOUBLE PRECISION,
    longitude   DOUBLE PRECISION,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Координаты (если заданы) должны быть в разумных пределах
    CONSTRAINT chk_car_wash_latitude
        CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
    CONSTRAINT chk_car_wash_longitude
        CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180))
);

-- Поиск моек по названию/адресу и гео
CREATE INDEX idx_car_wash_name ON car_wash (name);
CREATE INDEX idx_car_wash_address ON car_wash (address);
CREATE INDEX idx_car_wash_lat_lon ON car_wash (latitude, longitude);

------------------------------------------------------------
-- Таблица боксов автомоек
------------------------------------------------------------
CREATE TABLE wash_box (
    id           BIGSERIAL PRIMARY KEY,
    carwash_id   BIGINT NOT NULL,
    number       INT NOT NULL,
    status       VARCHAR(50) NOT NULL,

    CONSTRAINT fk_wash_box_carwash
        FOREIGN KEY (carwash_id)
        REFERENCES car_wash (id)
        ON DELETE RESTRICT,

    -- В пределах одной мойки номер бокса уникален
    CONSTRAINT uq_wash_box_carwash_number
        UNIQUE (carwash_id, number)
);

CREATE INDEX idx_wash_box_carwash_id ON wash_box (carwash_id);
CREATE INDEX idx_wash_box_status ON wash_box (status);

------------------------------------------------------------
-- Таблица тарифов
------------------------------------------------------------
CREATE TABLE tariff (
    id                BIGSERIAL PRIMARY KEY,
    name              VARCHAR(150) NOT NULL,
    price_per_minute  NUMERIC(10,2) NOT NULL,
    description       TEXT,
    active            BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT chk_tariff_price_positive
        CHECK (price_per_minute > 0)
);

-- Можно хотеть уникальные имена тарифов; если не нужно — удалите этот UNIQUE
-- CONSTRAINT uq_tariff_name UNIQUE (name);

CREATE INDEX idx_tariff_active ON tariff (active);
CREATE INDEX idx_tariff_price ON tariff (price_per_minute);

------------------------------------------------------------
-- Таблица сессий мойки
------------------------------------------------------------
CREATE TABLE wash_session (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL,
    box_id        BIGINT NOT NULL,
    tariff_id     BIGINT NOT NULL,
    started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at      TIMESTAMPTZ,
    total_amount  NUMERIC(10,2),
    status        VARCHAR(50) NOT NULL,

    CONSTRAINT fk_wash_session_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_wash_session_box
        FOREIGN KEY (box_id)
        REFERENCES wash_box (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_wash_session_tariff
        FOREIGN KEY (tariff_id)
        REFERENCES tariff (id)
        ON DELETE RESTRICT,

    -- Итоговая сумма, если задана, не может быть отрицательной
    CONSTRAINT chk_wash_session_total_amount_non_negative
        CHECK (total_amount IS NULL OR total_amount >= 0)
);

-- Частые выборки: сессии пользователя, бокса, по статусу и дате
CREATE INDEX idx_wash_session_user_id ON wash_session (user_id);
CREATE INDEX idx_wash_session_box_id ON wash_session (box_id);
CREATE INDEX idx_wash_session_tariff_id ON wash_session (tariff_id);
CREATE INDEX idx_wash_session_status ON wash_session (status);
CREATE INDEX idx_wash_session_started_at ON wash_session (started_at);
-- Например, история пользователя по дате
CREATE INDEX idx_wash_session_user_started_at
    ON wash_session (user_id, started_at DESC);

------------------------------------------------------------
-- Таблица платежей
-- По ER-диаграмме: отношение 1:1 с wash_session
------------------------------------------------------------
CREATE TABLE payment (
    id          BIGSERIAL PRIMARY KEY,
    session_id  BIGINT NOT NULL,
    amount      NUMERIC(10,2) NOT NULL,
    method      VARCHAR(50) NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status      VARCHAR(50) NOT NULL,

    CONSTRAINT fk_payment_session
        FOREIGN KEY (session_id)
        REFERENCES wash_session (id)
        ON DELETE RESTRICT,

    -- Один платеж на одну сессию (1:1)
    CONSTRAINT uq_payment_session UNIQUE (session_id),

    CONSTRAINT chk_payment_amount_positive
        CHECK (amount > 0)
);

CREATE INDEX idx_payment_status ON payment (status);
CREATE INDEX idx_payment_timestamp ON payment ("timestamp");

------------------------------------------------------------
-- Таблица бонусного баланса пользователя
-- 1:1 с users
------------------------------------------------------------
CREATE TABLE bonus_balance (
    id        BIGSERIAL PRIMARY KEY,
    user_id   BIGINT NOT NULL,
    balance   INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_bonus_balance_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE RESTRICT,

    -- Один баланс на одного пользователя
    CONSTRAINT uq_bonus_balance_user UNIQUE (user_id),

    -- Баланс, как правило, не отрицательный
    CONSTRAINT chk_bonus_balance_non_negative
        CHECK (balance >= 0)
);

------------------------------------------------------------
-- Таблица операций по бонусам
------------------------------------------------------------
CREATE TABLE bonus_transaction (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    amount      INT NOT NULL,
    reason      TEXT,
    session_id  BIGINT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_bonus_transaction_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_bonus_transaction_session
        FOREIGN KEY (session_id)
        REFERENCES wash_session (id)
        ON DELETE RESTRICT,

    -- Операция должна что-то менять (не 0)
    CONSTRAINT chk_bonus_transaction_amount_non_zero
        CHECK (amount <> 0)
);

-- Частые выборки: история по пользователю, сессии, дате
CREATE INDEX idx_bonus_transaction_user_id ON bonus_transaction (user_id);
CREATE INDEX idx_bonus_transaction_session_id ON bonus_transaction (session_id);
CREATE INDEX idx_bonus_transaction_created_at ON bonus_transaction (created_at);
