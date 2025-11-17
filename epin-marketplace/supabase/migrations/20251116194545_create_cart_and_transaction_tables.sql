CREATE TABLE "public"."carts" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" uuid NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE "public"."carts" OWNER TO "postgres";

CREATE TABLE "public"."cart_items" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "cart_id" uuid NOT NULL,
    "product_id" character varying NOT NULL,
    "quantity" integer NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE "public"."cart_items" OWNER TO "postgres";

CREATE TABLE "public"."transactions" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" uuid NOT NULL,
    "amount" numeric NOT NULL,
    "type" character varying NOT NULL,
    "status" character varying NOT NULL,
    "details" jsonb,
    "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE "public"."transactions" OWNER TO "postgres";

ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE;
