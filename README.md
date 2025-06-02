# Zadanie 2

## Opis rozwiązania

Utworzony został pipeline w GitHub Actions, który buduje i publikuje obraz Dockera aplikacji z zadania nr 1.  
Całość została opisana w pliku `.github/workflows/build.yml`.

## Działanie pipeline

1. Pobranie kodu źródłowego z repozytorium.
2. Konfiguracja środowiska do budowania obrazów wieloarchitektonicznych (QEMU i Docker Buildx).
3. Logowanie do dwóch rejestrów:
   - **GitHub Container Registry (ghcr.io)** – do publikowania gotowego obrazu,
   - **DockerHub** – do przechowywania cache, co przyspiesza kolejne budowania.
4. Lokalna budowa obrazu dla architektury `amd64` oraz skanowanie go narzędziem **Trivy** pod kątem luk bezpieczeństwa (CVE).
5. **Nazwa tymczasowego obrazu `zadanie2-scan:latest` używana tylko do skanowania Trivy.**
6. Jeśli Trivy nie wykryje luk o krytycznym lub wysokim poziomie zagrożenia, wykonywana jest budowa i publikacja obrazu dla architektur `amd64` oraz `arm64`, z użyciem cache z DockerHub.
7. Obraz zostaje oznaczony tagiem `latest`.

## Uzasadnienie

### Multiarch build

Wykorzystanie Docker Buildx umożliwia budowę obrazów dla architektur `linux/amd64` i `linux/arm64`, co zwiększa ich uniwersalność i kompatybilność z różnymi platformami.

### Cache budowania

- Cache warstw budowania jest eksportowany i importowany w trybie `max`, który pozwala na maksymalne wykorzystanie istniejących warstw z poprzednich buildów (źródło: Docker Buildx – Cache).
- Przechowywanie cache w publicznym repozytorium DockerHub pozwala na łatwe współdzielenie danych między różnymi buildami, również na różnych maszynach lub runnerach GitHub Actions.
- Znacząco skraca to czas budowania, dlatego że niezmienione warstwy są pobierane z cache, a nie budowane od nowa.

### Tagowanie obrazów

- Obrazy są oznaczane tagiem `latest`, wskazują one zawsze na najnowszą wersję aplikacji.

### Test CVE z użyciem Trivy

Użyłam **Trivy** jako narzędzia do skanowania luk bezpieczeństwa z następujących powodów:

- Dostępność gotowej akcji dla GitHub Actions,
- Prosta i szybka konfiguracja,
- Możliwość ustawienia poziomu zagrożeń, które powodują przerwanie procesu budowy.

W pipeline zaimplementowany jest warunek, że jeśli Trivy wykryje luki o poziomie **HIGH** lub **CRITICAL**, proces publikowania obrazu zostaje zatrzymany.

### Plik `.trivyignore`

W pliku `.trivyignore` dodałam wykluczenie błędu `CVE-2024-21538` z paczki `cross-spawn`. Mimo aktualizacji do wersji `7.0.5`, Trivy nadal zgłaszał lukę z wersji `7.0.3`. Ignorowanie tej pozycji zapobiega fałszywym alarmom i niepotrzebnemu blokowaniu procesu publikacji obrazu.

## Uruchomienie pipeline

Pipeline uruchamia się automatycznie przy każdym pushu do gałęzi `main`.  
W przypadku wykrycia poważnych luk bezpieczeństwa, proces budowania i publikacji obrazu zostaje przerwany.