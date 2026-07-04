"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useTranslations, useLocale } from "next-intl";
import { ProductType, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { PRODUCT_IMAGES } from "@/constants/product_images";
import shopHero from "../../../public/assets/barbecue.jpg";

let stripePromise: ReturnType<typeof loadStripe> | null = null;

function getStripePromise() {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) return null;
    if (!stripePromise) {
        stripePromise = loadStripe(key);
    }
    return stripePromise;
}

interface CartEntry extends CartItem {
    product: ProductType;
}

function PaymentForm({
    amount,
    clientEmail,
    onCancel,
}: {
    amount: number;
    clientEmail: string;
    onCancel: () => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const t = useTranslations("shop_page");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setProcessing(true);
        const { error: payError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment/success?type=shop`,
                receipt_email: clientEmail,
            },
        });
        if (payError) {
            setError(payError.message || "Payment failed");
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handlePay} className="space-y-4 mt-4 border-t border-brand-sand pt-4">
            <p className="text-brand-terracotta font-bold">{t("total")}: €{amount.toFixed(2)}</p>
            <PaymentElement />
            <div className="flex gap-2">
                <Button type="submit" disabled={processing} className="flex-1">
                    {processing ? "..." : t("checkout")}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
    );
}

function ShopCheckoutWrapper({
    cart,
    clientEmail,
    onCancel,
}: {
    cart: CartEntry[];
    clientEmail: string;
    onCancel: () => void;
}) {
    const [clientSecret, setClientSecret] = useState("");
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/purchase/payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: cart.map(({ productId, quantity }) => ({ productId, quantity })),
                clientEmail,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) throw new Error(data.message);
                setClientSecret(data.message.clientSecret);
                setAmount(data.message.amount);
            })
            .catch((err) => setError(err.message));
    }, [cart, clientEmail]);

    if (error) return <p className="text-red-400">{error}</p>;
    if (!clientSecret) return <p className="text-brand-muted">Loading payment...</p>;

    const stripe = getStripePromise();
    if (!stripe) return <p className="text-red-400">Payment is not configured.</p>;

    return (
        <Elements stripe={stripe} options={{ clientSecret, appearance: { theme: "night" } }}>
            <PaymentForm amount={amount} clientEmail={clientEmail} onCancel={onCancel} />
        </Elements>
    );
}

function ProductCardImage({
    productId,
    alt,
}: {
    productId: string;
    alt: string;
}) {
    const image = PRODUCT_IMAGES[productId];
    if (!image) return null;

    return (
        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-md">
            <Image
                src={image}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
            />
        </div>
    );
}

export default function ShopPage() {
    const t = useTranslations("shop_page");
    const locale = useLocale();
    const [products, setProducts] = useState<ProductType[]>([]);
    const [cart, setCart] = useState<CartEntry[]>([]);
    const [email, setEmail] = useState("");
    const [checkout, setCheckout] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) setProducts(data.message || []);
            })
            .finally(() => setLoading(false));
    }, []);

    const addToCart = (product: ProductType) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.productId === product.productId);
            if (existing) {
                return prev.map((item) =>
                    item.productId === product.productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { productId: product.productId, quantity: 1, product }];
        });
    };

    const cartTotal = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const getProductName = (p: ProductType) =>
        locale === "it" && p.nameIt ? p.nameIt : p.name;
    const getProductDesc = (p: ProductType) =>
        locale === "it" && p.descriptionIt ? p.descriptionIt : p.description;
    const getProductUnit = (p: ProductType) =>
        locale === "it" && p.unitIt ? p.unitIt : p.unit;

    return (
        <div className="min-h-screen bg-brand-linen text-brand-ink pt-28 pb-16 px-4">
            <div className="max-w-5xl mx-auto">
                <header className="relative mb-12 h-[240px] overflow-hidden rounded-xl md:h-[320px]">
                    <Image
                        src={shopHero}
                        alt=""
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 1024px"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-brand-ink/50" />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
                        <h1 className="text-4xl font-bold text-brand-linen mb-2">
                            {t("title")}
                        </h1>
                        <p className="text-brand-linen/90">{t("subtitle")}</p>
                    </div>
                </header>

                {loading && <p className="text-center">Loading...</p>}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {products.map((product) => (
                        <div
                            key={product.productId}
                            className="border border-brand-sand p-6 bg-brand-stone shadow-soft"
                        >
                            <ProductCardImage
                                productId={product.productId}
                                alt={getProductName(product)}
                            />
                            <h3 className="text-xl font-semibold text-brand-ink mb-2">
                                {getProductName(product)}
                            </h3>
                            <p className="text-brand-muted text-sm mb-4">{getProductDesc(product)}</p>
                            <p className="text-lg font-bold mb-4 text-brand-ink">
                                €{product.price.toFixed(2)} / {getProductUnit(product)}
                            </p>
                            <Button
                                onClick={() => addToCart(product)}
                                className="w-full"
                            >
                                {t("add_to_cart")}
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="border border-brand-sand p-6 bg-brand-stone shadow-soft max-w-lg mx-auto">
                    <h2 className="text-xl font-bold mb-4 text-brand-ink">Cart</h2>
                    {cart.length === 0 ? (
                        <p className="text-brand-muted">{t("empty_cart")}</p>
                    ) : (
                        <>
                            <ul className="space-y-2 mb-4">
                                {cart.map((item) => (
                                    <li key={item.productId} className="flex justify-between">
                                        <span>
                                            {getProductName(item.product)} x{item.quantity}
                                        </span>
                                        <span>€{(item.product.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="font-bold text-brand-terracotta mb-4">
                                {t("total")}: €{cartTotal.toFixed(2)}
                            </p>
                            {!checkout ? (
                                <div className="space-y-3">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border rounded p-2 text-gray-900"
                                        required
                                    />
                                    <Button
                                        className="w-full"
                                        disabled={!email || cart.length === 0}
                                        onClick={() => setCheckout(true)}
                                    >
                                        {t("checkout")}
                                    </Button>
                                </div>
                            ) : (
                                <ShopCheckoutWrapper
                                    cart={cart}
                                    clientEmail={email}
                                    onCancel={() => setCheckout(false)}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
