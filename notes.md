Shades of Blue
ICON: #27406d
LIGHTCOLOR: #839ef9
DARK BLUE BACKGROUND COLOR: #27406d
BLUE DARK FONT: #4646a5
Focus Color (green): #4CAF50
Backgroud Color (bluish pestal):  rgb(244 245 255)



################## DEPLOY ###################
CREATES a IMAGE IN REGISTRY
gcloud builds submit --tag asia-south1-docker.pkg.dev/marketreports/next-reports-frontend/nextjs-frontend-app


DEPLOYS TO RUN
gcloud run deploy nextjs-frontend-app --image=asia-south1-docker.pkg.dev/marketreports/next-reports-frontend/nextjs-frontend-app --platform=managed --region=asia-south1 --allow-unauthenticated
