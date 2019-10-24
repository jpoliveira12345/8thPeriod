# Encryption

# K1
openssl enc -des-cbc      -iv 0BC3D9D -kfile keys/K1  -in PlainText -out encryptedData/K1

# K2
openssl enc -aes-128-cbc  -iv 0BC3D9D -kfile keys/K2  -in PlainText -out encryptedData/K2

# K3
openssl enc -aes-256-cbc  -iv 0BC3D9D -kfile keys/K3  -in PlainText -out encryptedData/K3

# Decryption

# K1
openssl enc -des-cbc      -iv 0BC3D9D -kfile keys/K1 -d -in encryptedData/K1 -out decryptedData/K1

# K2
openssl enc -aes-128-cbc  -iv 0BC3D9D -kfile keys/K2 -d -in encryptedData/K2 -out decryptedData/K2

# K3
openssl enc -aes-256-cbc  -iv 0BC3D9D -kfile keys/K3 -d -in encryptedData/K3 -out decryptedData/K3