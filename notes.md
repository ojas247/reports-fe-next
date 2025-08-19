Shades of Blue
ICON: #27406d
LIGHTCOLOR: #839ef9
DARK BLUE BACKGROUND COLOR: #27406d
BLUE DARK FONT: #4646a5
Focus Color (green): #4CAF50
Backgroud Color (bluish pestal):  rgb(244 245 255)



################## DEPLOY ###################
CREATES a IMAGE IN REGISTRY
gcloud builds submit --tag asia-east1-docker.pkg.dev/marketreports/next-reports-frontend/nextjs-frontend-app


DEPLOYS TO RUN
gcloud run deploy nextjs-frontend-app --image=asia-east1-docker.pkg.dev/marketreports/next-reports-frontend/nextjs-frontend-app --platform=managed --region=asia-east1 --allow-unauthenticated






######################## HYPERLINKING ########################
description = "Visit our platform at @link-start platform @link-end @url-start https://example.com @url-end\n This is second bullet point"

To break link use \n
To split para in desc1 an desc2 use \p