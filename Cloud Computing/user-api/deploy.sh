GOOGLE_PROJECT_ID=ancient-dragon-403014
CLOUD_RUN_SERVICE=soulbabble-user-api
INSTANCE_CONNECTION_NAME=ancient-dragon-403014:asia-southeast2:soulbabble
DB_USER=root
DB_PASS=soulbabbledatabase
DB_NAME=soulbbaledatabase
gcloud builds submit -tag gcr.io/$GOOGLE_PROJECT_ID/$CLOUD_RUN_SERVICE \
    --project=$GOOGLE_PROJECT_ID

gcloud run deploy $CLOUD_RUN_SERVICE \
    --image gcr.io/$GOOGLE_PROJECT_ID/$CLOUD_RUN_SERVICE \
    --add-cloudsql-instances $INSTANCE_CONNECTION_NAME\
    --update-env-vars INSTANCE_CONNECTION_NAME=$INSTANCE_CONNECTION_NAME,DB_PASS=$soulbabbledatabase, DB_USER=$root, DB_NAME=$soulbbaledatabase\
    --platform managed \
    --region asia-southeast2 \
    --allow-unauthenticated \
    -project-$GOOGLE_PROJECT_ID