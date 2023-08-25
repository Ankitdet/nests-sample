read -p "Enter your username, password, email, name" username password email name
  
  echo 
  
  echo "user ${username} signing-up"
  signupresult=$(aws cognito-idp sign-up --client-id "3m1fqcbd6f3jrj5vrfr6f1pede" --username "${username}" --password "${password}" --user-attributes Name="email",Value="${email}" Name="name",Value="${name}")
  echo "cognitoId: <<< "${signupresult}")"
  
  # echo
  
  # echo "user ${username} getting confirmed in the cognito"
  # confirmsignup=$(aws cognito-idp admin-confirm-sign-up --user-pool-id "us-east-1_oUSrvMj6K" --username "${username}")
  
  
  echo "user ${username} signing-in"
  signinresult=$(aws cognito-idp admin-initiate-auth --user-pool-id "us-east-1_oUSrvMj6K" --client-id "3m1fqcbd6f3jrj5vrfr6f1pede" --auth-parameters USERNAME="${username}",PASSWORD="${password}")
  IdToken=$(jq '.AuthenticationResult.IdToken' <<< "${signinresult}")
  echo "IdToken: ${IdToken}"
  
  echo
  
  echo "user ${username} getting identity-id"
  getidresult=$(aws cognito-identity get-id --account-id "325502665956" --identity-pool-id "us-east-1:e81c7cd8-65d5-4c73-8f55-f176ac5f13df" --logins "cognito-idp.us-east-1.amazonaws.com/us-east-1_oUSrvMj6K"="${IdToken}")
  IdentityId=$(jq -r '.IdentityId' <<< "${getidresult}")
  echo "IdentityId : ${IdentityId}"
  
  # echo
  
  # echo "user ${username} getting credentials"
  # getcredentialsforidentity=$(aws cognito-identity get-credentials-for-identity --identity-id "${IdentityId}" --custom-role-arn arn:aws:iam::325502665956:role/RBACDynamoDBReadOnlyAccess --logins "cognito-idp.us-east-1.amazonaws.com/us-east-1_fTsjH4jU6"="${IdToken}")
  # echo "${getcredentialsforidentity}"	