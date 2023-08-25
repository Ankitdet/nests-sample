read -p "Enter your username, password, email, and groupname: " username password email groupname
  
  echo 
  
  echo "user ${username} signing-up"
  signupresult=$(aws cognito-idp sign-up --client-id "7r7r53rdrr5ogt7t8amnnl8raf" --username "${username}" --password "${password}" --user-attributes Name="email",Value="${email}")
  echo "cognitoId: <<< "${signupresult}")"
  
  echo
  
  echo "user ${username} getting confirmed in the cognito"
  confirmsignup=$(aws cognito-idp admin-confirm-sign-up --user-pool-id "us-east-1_fTsjH4jU6" --username "${username}")
  
  echo 
  
  echo "adding user to group: ${groupname}"
  addusertogroupresult=$(aws cognito-idp admin-add-user-to-group --user-pool-id "us-east-1_fTsjH4jU6" --username "${username}" --group-name "${groupname}")
  echo
  
  echo "user ${username} signing-in"
  signinresult=$(aws cognito-idp admin-initiate-auth --user-pool-id "us-east-1_fTsjH4jU6" --client-id "7r7r53rdrr5ogt7t8amnnl8raf" --auth-flow "ADMIN_NO_SRP_AUTH" --auth-parameters USERNAME="${username}",PASSWORD="${password}")
  IdToken=$(jq '.AuthenticationResult.IdToken' <<< "${signinresult}")
  echo "IdToken: ${IdToken}"
  
  echo
  
  echo "user ${username} getting identity-id"
  getidresult=$(aws cognito-identity get-id --account-id "325502665956" --identity-pool-id "us-east-1:e81c7cd8-65d5-4c73-8f55-f176ac5f13df" --logins "cognito-idp.us-east-1.amazonaws.com/us-east-1_fTsjH4jU6"="${IdToken}")
  IdentityId=$(jq -r '.IdentityId' <<< "${getidresult}")
  echo "IdentityId : ${IdentityId}"
  
  echo
  
  echo "user ${username} getting credentials"
  getcredentialsforidentity=$(aws cognito-identity get-credentials-for-identity --identity-id "${IdentityId}" --custom-role-arn arn:aws:iam::325502665956:role/RBACDynamoDBReadOnlyAccess --logins "cognito-idp.us-east-1.amazonaws.com/us-east-1_fTsjH4jU6"="${IdToken}")
  echo "${getcredentialsforidentity}"	