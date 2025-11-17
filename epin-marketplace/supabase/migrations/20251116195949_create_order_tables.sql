CREATE TABLE "public"."orders" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" uuid NOT NULL,
    "total" numeric NOT NULL,
    "status" character varying NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE "public"."orders" OWNER TO "postgres";

CREATE TABLE "public"."order_items" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "order_id" uuid NOT NULL,
    "product_id" character varying NOT NULL,
    "quantity" integer NOT NULL,
    "price" numeric NOT NULL
);

ALTER TABLE "public"."order_items" OWNER TO "postgres";

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
