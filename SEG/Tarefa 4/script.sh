# Geração da chave privada 
openssl genrsa -out private.pem 2048

# Geração da chave pública
openssl rsa -in private.pem -pubout -out public.pem





