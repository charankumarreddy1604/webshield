# 🛡️ WebShield – Website Security Header Analyzer

## 1. Project Overview

WebShield is a cybersecurity project designed to analyze website security headers and HTTPS usage. It helps users identify missing security headers, understand potential security configuration weaknesses, calculate a basic security score, and view recommendations for improving website security.

The original project is implemented in Python using the `requests` library. The frontend version uses HTML, CSS, and JavaScript.

https://charankumarreddy1604.github.io/webshield/

## 2. Objectives

* Check whether a website uses HTTPS.
* Analyze six important HTTP security headers.
* Display website response status and available server information.
* Calculate a basic security score.
* Classify results into LOW, MEDIUM, or HIGH risk when sufficient checks are available.
* Provide recommendations for missing security headers.

## 3. Technologies Used

* **HTML5** – Structures the web interface.
* **CSS3** – Provides styling and responsive layout.
* **JavaScript** – Handles user input, browser requests, and result display.
* **Python** – Performs HTTP requests in the original backend implementation.
* **Requests** – Retrieves website responses and headers in Python.

## 4. Security Headers Checked

| Security Header           | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| Content-Security-Policy   | Helps protect against XSS and code injection. |
| X-Frame-Options           | Helps prevent clickjacking.                   |
| X-Content-Type-Options    | Helps prevent MIME-type sniffing.             |
| Strict-Transport-Security | Enforces HTTPS in supporting browsers.        |
| Referrer-Policy           | Controls referrer information.                |
| Permissions-Policy        | Controls selected browser features.           |

## 5. Project Structure

```text
WebShield/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

The original Python implementation can be retained separately as `webshield.py` if required.

## 6. How the Project Works

1. The user enters a website URL.
2. The application validates the URL.
3. It determines whether the URL uses HTTPS.
4. It attempts to retrieve the website response.
5. Available security headers are checked.
6. The application calculates a basic security score.
7. The results are displayed on the dashboard.
8. Recommendations are provided for potential security improvements.

## 7. Installation and Execution

### Requirements

* A computer with Windows, Linux, or macOS.
* A modern web browser such as Google Chrome.
* A code editor such as Visual Studio Code.

### Steps

1. Create a folder named `WebShield`.
2. Create the files `index.html`, `style.css`, `script.js`, and `README.md`.
3. Copy the appropriate code into each file.
4. Open `index.html` in your web browser.
5. Enter a website URL and select **Analyze Website**.

### Running the Original Python Version

Install the required Python library:

```bash
pip install requests
```

Run the Python script:

```bash
python webshield.py
```

Enter a website URL when prompted.

## 8. Sample Output

The dashboard displays information such as:

* Target website URL
* HTTPS status
* HTTP response status
* Server information, when available
* Security header status
* Security score
* Risk classification
* Security recommendations

Actual results depend on the target website and which response headers can be accessed.

## 9. Limitations

* Browser-based requests may be blocked by Cross-Origin Resource Sharing (CORS).
* Some servers hide server information or security headers.
* Header presence alone does not prove that a website is secure.
* The score is a basic educational indicator, not a complete security assessment.
* The frontend does not replace a full vulnerability scanner or penetration test.

For reliable analysis of arbitrary websites, connect the frontend to the original Python backend.

## 10. Future Enhancements

* Integrate the HTML frontend with a Flask or FastAPI backend.
* Generate downloadable scan reports.
* Add scan history and comparison features.
* Improve security scoring and configuration validation.
* Add charts and detailed recommendations.
* Implement secure input validation and request controls on the backend.

## 11. Ethical Use

Use WebShield only on websites you own or have explicit permission to assess. This project is intended for educational purposes and basic website security configuration analysis.

## 12. Conclusion

WebShield demonstrates how common HTTP security headers and HTTPS usage can be examined to identify potential configuration gaps. It provides a simple interface for presenting scan results and security recommendations, helping students understand fundamental web security concepts.
