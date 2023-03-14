#!/bin/sh

# The Webhook URL to GChat will be provided during runtime and you should make sure that GOOGLE_CHAT_WEBHOOK environment variables is available
if [[ ! -z "${GOOGLE_CHAT_WEBHOOK}" ]]; then
   echo "GOOGLE_CHAT_WEBHOOK is set. Preparing to Send Notification..."
else
   echo "GOOGLE_CHAT_WEBHOOK is not set. Aborting the process..."
   exit 1
fi



generate_post_data() 
{
cat <<EOF > msg.json
{
   "text":"\n*Operate First Deployment Alert - API Designer POC*\n\nRoute: http://api-designer-poc.apps.smaug.na.operate-first.cloud/  \nConsole URL: https://console-openshift-console.apps.smaug.na.operate-first.cloud/k8s/cluster/projects/api-designer/ \n"
}
EOF
}

# Create msg.json
generate_post_data


# Send GChat Notification
curl -i $GOOGLE_CHAT_WEBHOOK -X POST -H "Content-Type: application/json" --data-binary @msg.json