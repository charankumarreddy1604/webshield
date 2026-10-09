import requests
from urllib.parse import urlparse


SECURITY_HEADERS = {
    "Content-Security-Policy": "Protects against XSS and code injection attacks",
    "X-Frame-Options": "Helps prevent clickjacking attacks",
    "X-Content-Type-Options": "Prevents MIME-type sniffing",
    "Strict-Transport-Security": "Forces secure HTTPS connections",
    "Referrer-Policy": "Controls referrer information",
    "Permissions-Policy": "Controls browser permissions"
}


def check_website(url):

    print("\n" + "=" * 60)
    print("              WEBSHIELD")
    print("       WEBSITE SECURITY HEADER ANALYZER")
    print("=" * 60)

    # Add HTTPS automatically
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    parsed = urlparse(url)

    if not parsed.netloc:
        print("\n[!] Invalid website URL.")
        return

    print(f"\nTarget Website : {url}")
    print("-" * 60)

    # HTTPS check
    if parsed.scheme == "https":
        print("[PASS] HTTPS : Enabled")
        https_score = 1
    else:
        print("[FAIL] HTTPS : Not Enabled")
        https_score = 0

    # Connect to website
    try:

        response = requests.get(
            url,
            timeout=10,
            allow_redirects=True,
            headers={
                "User-Agent": "WebShield-Security-Scanner/1.0"
            }
        )

        print(f"[INFO] HTTP Status : {response.status_code}")
        print(f"[INFO] Final URL   : {response.url}")

        # Server information
        server = response.headers.get("Server", "Not disclosed")
        print(f"[INFO] Server      : {server}")

    except requests.exceptions.RequestException as error:

        print("\n[ERROR] Could not connect to the website.")
        print("Reason:", error)
        return

    # Security header analysis
    print("\nSECURITY HEADER ANALYSIS")
    print("-" * 60)

    score = https_score
    total = len(SECURITY_HEADERS) + 1

    missing_headers = []

    for header, description in SECURITY_HEADERS.items():

        if header in response.headers:
            print(f"[PASS] {header}")
            score += 1

        else:
            print(f"[MISS] {header}")
            missing_headers.append(header)

    # Calculate score
    percentage = (score / total) * 100

    if percentage >= 80:
        risk = "LOW"

    elif percentage >= 50:
        risk = "MEDIUM"

    else:
        risk = "HIGH"

    print("\n" + "=" * 60)

    print(f"Security Score : {score}/{total}")
    print(f"Security Level : {risk}")
    print(f"Score Percent  : {percentage:.1f}%")

    print("=" * 60)

    # Recommendations
    if missing_headers:

        print("\nRECOMMENDATIONS")
        print("-" * 60)

        for header in missing_headers:

            print(f"- Add {header}")
            print(f"  {SECURITY_HEADERS[header]}")

    else:

        print("\n[+] All checked security headers are present.")

    print("\n" + "=" * 60)
    print("              SCAN COMPLETED")
    print("=" * 60)


def main():

    print("\nWebShield - Website Security Header Analyzer")

    website = input("\nEnter website URL: ")

    check_website(website)


if __name__ == "__main__":
    main()