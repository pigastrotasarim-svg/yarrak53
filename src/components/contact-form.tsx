"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-navy/10 bg-white px-6 py-10 text-center">
        <CheckCircle2 className="mx-auto size-10 text-amber" />
        <h3 className="mt-4 font-display text-2xl text-navy">
          Mesajınız alındı
        </h3>
        <p className="mt-2 text-sm text-slate-ink/70">
          Ekibimiz en kısa sürede sizinle iletişime geçecek.
        </p>
        <Button
          type="button"
          className="mt-6 bg-navy text-white hover:bg-navy-deep"
          onClick={() => setSent(false)}
        >
          Yeni mesaj
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-navy/10 bg-white p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Ad Soyad" id="name">
          <Input id="name" name="name" required className="h-11" />
        </Field>
        <Field label="Şirket" id="company">
          <Input id="company" name="company" className="h-11" />
        </Field>
        <Field label="E-posta" id="email">
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="h-11"
          />
        </Field>
        <Field label="Telefon" id="phone">
          <Input id="phone" name="phone" type="tel" className="h-11" />
        </Field>
      </div>
      <Field label="Mesajınız" id="message" className="mt-5">
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Taşıma ihtiyacınızı kısaca anlatın…"
        />
      </Field>
      <Button
        type="submit"
        className="mt-6 h-11 bg-amber px-6 text-navy hover:bg-amber-light"
      >
        Gönder
        <Send className="size-4" data-icon="inline-end" />
      </Button>
    </form>
  );
}

function Field({
  label,
  id,
  children,
  className,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2 inline-block text-navy">
        {label}
      </Label>
      {children}
    </div>
  );
}
