cd# AutoParts Shop — Spring Boot + Angular

Projekt przedstawia sklep internetowy z częściami samochodowymi.

## Funkcje

- Backend Spring Boot REST API.
- Połączenie z bazą H2 przez Spring Data JPA.
- CRUD dla encji `CarPart`.
- Struktura warstwowa: Controller / Service / Repository.
- DTO + walidacja danych.
- Globalna obsługa błędów.
- Security Basic Auth.
- Publiczne endpointy GET dla katalogu sklepu.
- Operacje administracyjne POST / PUT / DELETE zabezpieczone rolą ADMIN.
- Spring Events po dodaniu części.
- Testy backendu.
- Frontend Angular przypominający witrynę sklepu.
- Osobny panel administratora do dodawania, edycji i usuwania ofert.

## Dane logowania administratora

```txt
admin / admin123
```

## Uruchomienie backendu

W IntelliJ IDEA otwórz folder:

```txt
Main
```

Następnie uruchom klasę:

```txt
CarPartsShopApplication.java
```

Backend działa pod adresem:

```txt
http://localhost:8080
```

Publiczne API katalogu:

```txt
GET http://localhost:8080/api/car-parts
```

Endpoint sprawdzający logowanie administratora:

```txt
GET http://localhost:8080/api/admin/check
```

## Uruchomienie frontendu

```bash
cd src
cd frontend
npm install
npm start
```

Frontend działa pod adresem:

```txt
http://localhost:4200
```

## Widoki frontendu

```txt
/               publiczna strona sklepu z katalogiem części
/admin/login    logowanie administratora
/admin          panel administratora do zarządzania ofertami
```

## Testy

```bash
cd backend
mvn test
```
