import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Digital Asset Links for the Sprout Baby TWA.
 *
 * Set these env vars in your deployment:
 *   NEXT_PUBLIC_ANDROID_PACKAGE_NAME     e.g. com.siblingstack.sprout
 *   ANDROID_SHA256_CERT_FINGERPRINT      the SHA-256 of your signing cert
 *                                        (comma-separate multiple keys, e.g.
 *                                         upload key + Play App Signing)
 *
 * Get the fingerprint from your keystore:
 *   keytool -list -v -keystore android.keystore -alias sprout
 */
export function GET() {
  const packageName =
    process.env.NEXT_PUBLIC_ANDROID_PACKAGE_NAME ?? "com.siblingstack.sprout";
  const fingerprints = (process.env.ANDROID_SHA256_CERT_FINGERPRINT ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return NextResponse.json(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: packageName,
          sha256_cert_fingerprints: fingerprints,
        },
      },
    ],
    {
      headers: { "Cache-Control": "public, max-age=3600" },
    },
  );
}
