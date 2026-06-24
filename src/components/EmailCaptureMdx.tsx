"use client";

import EmailCaptureForm from "@/components/EmailCaptureForm";

interface Props {
  source: string;
}

export default function EmailCaptureMdx({ source }: Props) {
  return <EmailCaptureForm source={source} />;
}
