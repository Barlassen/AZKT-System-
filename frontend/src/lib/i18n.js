// Internationalization (i18n) for AZKT System

const translations = {
  de: {
    // Header
    menu: 'Menü',
    search: 'Suchen',
    login: 'Anmelden',
    language: 'Deutsch',
    
    // Form
    from: 'Von',
    to: 'Nach',
    date: 'Datum',
    time: 'Zeit',
    depart: 'Ab',
    arrive: 'An',
    settings: 'Einstellungen',
    ticketType: 'Ticket-Typ',
    singleTicket: 'Einzelfahrkarte',
    dayPass: 'Tageskarte',
    getTicket: 'Anonymes Ticket erhalten',
    generating: 'Anonymes Ticket wird generiert...',
    
    // Ticket Display
    yourTicket: 'Ihr anonymes Ticket',
    validUntil: 'Gültig bis',
    type: 'Typ',
    price: 'Preis',
    at: 'um',
    copyTicket: 'Ticket-Daten kopieren',
    copied: '✓ Kopiert!',
    newTicket: 'Neues Ticket anfordern',
    
    // Features
    anonymous: '100% Anonym',
    noPersonalData: 'Keine persönlichen Daten',
    copySafe: 'COPY-SAFE',
    printHome: 'PRINT@HOME',
    multiCheck: 'MULTI-CHECK',
    easyAccess: 'EINFACHER ZUGANG',
    sbbFeatures: 'SBB-konforme Funktionen',
    copySafeDesc: 'QR kann nicht kopiert werden',
    anonymousDesc: 'Keine persönlichen Daten',
    multiCheckDesc: 'Kann mehrmals überprüft werden',
    printHomeDesc: 'Auf Papier drucken',
    easyAccessDesc: 'Einfacher Ein-Bildschirm-Prozess',
    
    // Security
    securityFeatures: 'Sicherheitsfunktionen',
    zkProof: 'ZK-Beweis',
    signature: 'Signatur',
    ephemeralKey: 'Ephemeraler Schlüssel',
    generated: '✓ Generiert',
    missing: '✗ Fehlt',
    signedBySBB: '✓ Von SBB signiert',
    active: 'Aktiv (Einmalverwendung)',
    
    // Notes
    showQR: 'Zeigen Sie diesen QR-Code dem Schaffner zur Überprüfung.',
    printTicket: 'Sie können dieses Ticket zu Hause drucken (PRINT@HOME).',
    multiCheckNote: 'Dieses Ticket kann mehrmals überprüft werden (MULTI-CHECK).',
    copySafeNote: 'COPY-SAFE: QR-Code kann nicht kopiert und von anderen verwendet werden.',
    
    // Footer
    identityNeverShared: 'Ihre Identität wird niemals mit SBB geteilt',
    ephemeralWallet: 'Ephemeraler Wallet',
    merkleRoot: 'Merkle Root',
    
    // Errors
    loadingRoutes: 'Routen werden geladen...',
    noRoutes: 'Keine Routen verfügbar. Backend-Verbindung überprüfen.',
    retry: 'Wiederholen',
    selectRoute: 'Abfahrtsbahnhof auswählen',
    
    // Payment
    payment: 'Zahlung',
    ticketSummary: 'Ticket-Zusammenfassung',
    route: 'Route',
    total: 'Gesamt',
    cardNumber: 'Kartennummer',
    cardName: 'Karteninhaber',
    cardNamePlaceholder: 'Vorname Nachname',
    expiryDate: 'Ablaufdatum',
    cvv: 'CVV',
    pay: 'Bezahlen',
    cancel: 'Abbrechen',
    processing: 'Wird verarbeitet...',
    paymentNote: 'Dies ist eine Mock-Zahlung für den Hackathon. Keine echten Zahlungen werden verarbeitet.',
    invalidCardNumber: 'Ungültige Kartennummer',
    invalidCardName: 'Bitte geben Sie den Karteninhaber ein',
    invalidExpiry: 'Ungültiges Ablaufdatum',
    invalidCvv: 'Ungültiger CVV',
    dayPassNote: 'Tageskarte beinhaltet unbegrenzte Fahrten für den Tag',
    
    // Ticket History
    ticketHistory: 'Ticket-Verlauf',
    noTickets: 'Keine gespeicherten Tickets',
    expired: 'Abgelaufen',
    printTicket: 'Ticket drucken',
    shareTicket: 'Ticket teilen',
    
    // Discount
    discountCodePlaceholder: 'Rabattcode eingeben',
    apply: 'Anwenden',
    discountApplied: 'Rabatt angewendet',
    invalidDiscountCode: 'Ungültiger Rabattcode',
    originalPrice: 'Ursprünglicher Preis',
    youSave: 'Sie sparen',
  },
  
  en: {
    // Header
    menu: 'Menu',
    search: 'Search',
    login: 'Login',
    language: 'English',
    
    // Form
    from: 'From',
    to: 'To',
    date: 'Date',
    time: 'Time',
    depart: 'Depart',
    arrive: 'Arrive',
    settings: 'Settings',
    ticketType: 'Ticket Type',
    singleTicket: 'Single Ticket',
    dayPass: 'Day Pass',
    getTicket: 'Get Anonymous Ticket',
    generating: 'Generating Anonymous Ticket...',
    
    // Ticket Display
    yourTicket: 'Your Anonymous Ticket',
    validUntil: 'Valid Until',
    type: 'Type',
    price: 'Price',
    copyTicket: 'Copy Ticket Data',
    copied: '✓ Copied!',
    newTicket: 'Request New Ticket',
    
    // Features
    anonymous: '100% Anonymous',
    noPersonalData: 'No Personal Data',
    copySafe: 'COPY-SAFE',
    printHome: 'PRINT@HOME',
    multiCheck: 'MULTI-CHECK',
    easyAccess: 'EASY ACCESS',
    sbbFeatures: 'SBB Compliant Features',
    copySafeDesc: 'QR cannot be copied',
    anonymousDesc: 'Zero personal data',
    multiCheckDesc: 'Can be verified multiple times',
    printHomeDesc: 'Print on paper',
    easyAccessDesc: 'Simple one-screen process',
    
    // Security
    securityFeatures: 'Security Features',
    zkProof: 'ZK Proof',
    signature: 'Signature',
    ephemeralKey: 'Ephemeral Key',
    generated: '✓ Generated',
    missing: '✗ Missing',
    signedBySBB: '✓ Signed by SBB',
    active: 'Active (single-use)',
    
    // Notes
    showQR: 'Show this QR code to the conductor for verification.',
    printTicket: 'You can print this ticket at home (PRINT@HOME).',
    multiCheckNote: 'This ticket can be checked multiple times (MULTI-CHECK).',
    copySafeNote: 'COPY-SAFE: QR code cannot be copied and used by others.',
    
    // Footer
    identityNeverShared: 'Your identity is never shared with SBB',
    ephemeralWallet: 'Ephemeral wallet',
    merkleRoot: 'Merkle Root',
    
    // Errors
    loadingRoutes: 'Loading routes...',
    noRoutes: 'No routes available. Check backend connection.',
    retry: 'Retry',
    selectRoute: 'Select departure station',
    
    // Payment
    payment: 'Payment',
    ticketSummary: 'Ticket Summary',
    route: 'Route',
    total: 'Total',
    cardNumber: 'Card Number',
    cardName: 'Cardholder Name',
    cardNamePlaceholder: 'John Doe',
    expiryDate: 'Expiry Date',
    cvv: 'CVV',
    pay: 'Pay',
    cancel: 'Cancel',
    processing: 'Processing...',
    paymentNote: 'This is a mock payment for hackathon. No real payments are processed.',
    invalidCardNumber: 'Invalid card number',
    invalidCardName: 'Please enter cardholder name',
    invalidExpiry: 'Invalid expiry date',
    invalidCvv: 'Invalid CVV',
    dayPassNote: 'Day pass includes unlimited travel for the day',
    
    // Ticket History
    ticketHistory: 'Ticket History',
    noTickets: 'No saved tickets',
    expired: 'Expired',
    printTicket: 'Print Ticket',
    shareTicket: 'Share Ticket',
    
    // Discount
    discountCodePlaceholder: 'Enter discount code',
    apply: 'Apply',
    discountApplied: 'Discount applied',
    invalidDiscountCode: 'Invalid discount code',
    originalPrice: 'Original Price',
    youSave: 'You save',
  },
  
  fr: {
    // Header
    menu: 'Menu',
    search: 'Rechercher',
    login: 'Se connecter',
    language: 'Français',
    
    // Form
    from: 'De',
    to: 'Vers',
    date: 'Date',
    time: 'Heure',
    depart: 'Départ',
    arrive: 'Arrivée',
    settings: 'Paramètres',
    ticketType: 'Type de billet',
    singleTicket: 'Billet simple',
    dayPass: 'Passe journée',
    getTicket: 'Obtenir un billet anonyme',
    generating: 'Génération du billet anonyme...',
    
    // Ticket Display
    yourTicket: 'Votre billet anonyme',
    validUntil: 'Valable jusqu\'au',
    type: 'Type',
    price: 'Prix',
    at: 'à',
    copyTicket: 'Copier les données du billet',
    copied: '✓ Copié!',
    newTicket: 'Demander un nouveau billet',
    
    // Features
    anonymous: '100% Anonyme',
    noPersonalData: 'Aucune donnée personnelle',
    copySafe: 'COPY-SAFE',
    printHome: 'PRINT@HOME',
    multiCheck: 'MULTI-CHECK',
    easyAccess: 'ACCÈS FACILE',
    sbbFeatures: 'Fonctionnalités conformes SBB',
    copySafeDesc: 'Le QR ne peut pas être copié',
    anonymousDesc: 'Aucune donnée personnelle',
    multiCheckDesc: 'Peut être vérifié plusieurs fois',
    printHomeDesc: 'Imprimer sur papier',
    easyAccessDesc: 'Processus simple en un écran',
    
    // Security
    securityFeatures: 'Fonctionnalités de sécurité',
    zkProof: 'Preuve ZK',
    signature: 'Signature',
    ephemeralKey: 'Clé éphémère',
    generated: '✓ Généré',
    missing: '✗ Manquant',
    signedBySBB: '✓ Signé par SBB',
    active: 'Actif (usage unique)',
    
    // Notes
    showQR: 'Montrez ce code QR au conducteur pour vérification.',
    printTicket: 'Vous pouvez imprimer ce billet à domicile (PRINT@HOME).',
    multiCheckNote: 'Ce billet peut être vérifié plusieurs fois (MULTI-CHECK).',
    copySafeNote: 'COPY-SAFE: Le code QR ne peut pas être copié et utilisé par d\'autres.',
    
    // Footer
    identityNeverShared: 'Votre identité n\'est jamais partagée avec SBB',
    ephemeralWallet: 'Portefeuille éphémère',
    merkleRoot: 'Racine Merkle',
    
    // Errors
    loadingRoutes: 'Chargement des itinéraires...',
    noRoutes: 'Aucun itinéraire disponible. Vérifiez la connexion au serveur.',
    retry: 'Réessayer',
    selectRoute: 'Sélectionner la gare de départ',
    
    // Payment
    payment: 'Paiement',
    ticketSummary: 'Résumé du billet',
    route: 'Itinéraire',
    total: 'Total',
    cardNumber: 'Numéro de carte',
    cardName: 'Nom du titulaire',
    cardNamePlaceholder: 'Jean Dupont',
    expiryDate: 'Date d\'expiration',
    cvv: 'CVV',
    pay: 'Payer',
    cancel: 'Annuler',
    processing: 'Traitement en cours...',
    paymentNote: 'Ceci est un paiement fictif pour le hackathon. Aucun paiement réel n\'est traité.',
    invalidCardNumber: 'Numéro de carte invalide',
    invalidCardName: 'Veuillez entrer le nom du titulaire',
    invalidExpiry: 'Date d\'expiration invalide',
    invalidCvv: 'CVV invalide',
    dayPassNote: 'Le passe journée comprend des trajets illimités pour la journée',
    
    // Ticket History
    ticketHistory: 'Historique des billets',
    noTickets: 'Aucun billet enregistré',
    expired: 'Expiré',
    printTicket: 'Imprimer le billet',
    shareTicket: 'Partager le billet',
    
    // Discount
    discountCodePlaceholder: 'Entrer le code de réduction',
    apply: 'Appliquer',
    discountApplied: 'Réduction appliquée',
    invalidDiscountCode: 'Code de réduction invalide',
    originalPrice: 'Prix original',
    youSave: 'Vous économisez',
  },
  
  tr: {
    // Header
    menu: 'Menü',
    search: 'Ara',
    login: 'Giriş Yap',
    language: 'Türkçe',
    
    // Form
    from: 'Nereden',
    to: 'Nereye',
    date: 'Tarih',
    time: 'Saat',
    depart: 'Kalkış',
    arrive: 'Varış',
    settings: 'Ayarlar',
    ticketType: 'Bilet Türü',
    singleTicket: 'Tek Yön',
    dayPass: 'Günlük Bilet',
    getTicket: 'Anonim Bilet Al',
    generating: 'Anonim bilet oluşturuluyor...',
    
    // Ticket Display
    yourTicket: 'Anonim Biletiniz',
    validUntil: 'Geçerlilik',
    type: 'Tür',
    price: 'Fiyat',
    at: 'saat',
    copyTicket: 'Bilet Verilerini Kopyala',
    copied: '✓ Kopyalandı!',
    newTicket: 'Yeni Bilet İste',
    
    // Features
    anonymous: '%100 Anonim',
    noPersonalData: 'Kişisel Veri Yok',
    copySafe: 'COPY-SAFE',
    printHome: 'PRINT@HOME',
    multiCheck: 'MULTI-CHECK',
    easyAccess: 'KOLAY ERİŞİM',
    sbbFeatures: 'SBB Uyumlu Özellikler',
    copySafeDesc: 'QR kod kopyalanamaz',
    anonymousDesc: 'Sıfır kişisel veri',
    multiCheckDesc: 'Birden fazla kez doğrulanabilir',
    printHomeDesc: 'Kağıda yazdır',
    easyAccessDesc: 'Basit tek ekran süreci',
    
    // Security
    securityFeatures: 'Güvenlik Özellikleri',
    zkProof: 'ZK Kanıtı',
    signature: 'İmza',
    ephemeralKey: 'Geçici Anahtar',
    generated: '✓ Oluşturuldu',
    missing: '✗ Eksik',
    signedBySBB: '✓ SBB tarafından imzalandı',
    active: 'Aktif (tek kullanımlık)',
    
    // Notes
    showQR: 'Doğrulama için bu QR kodu kondüktöre gösterin.',
    printTicket: 'Bu bileti evde yazdırabilirsiniz (PRINT@HOME).',
    multiCheckNote: 'Bu bilet birden fazla kez kontrol edilebilir (MULTI-CHECK).',
    copySafeNote: 'COPY-SAFE: QR kod kopyalanamaz ve başkaları tarafından kullanılamaz.',
    
    // Footer
    identityNeverShared: 'Kimliğiniz SBB ile asla paylaşılmaz',
    ephemeralWallet: 'Geçici cüzdan',
    merkleRoot: 'Merkle Kökü',
    
    // Errors
    loadingRoutes: 'Rotalar yükleniyor...',
    noRoutes: 'Rota bulunamadı. Backend bağlantısını kontrol edin.',
    retry: 'Tekrar Dene',
    selectRoute: 'Kalkış istasyonu seçin',
    
    // Payment
    payment: 'Ödeme',
    ticketSummary: 'Bilet Özeti',
    route: 'Rota',
    total: 'Toplam',
    cardNumber: 'Kart Numarası',
    cardName: 'Kart Sahibi',
    cardNamePlaceholder: 'Ad Soyad',
    expiryDate: 'Son Kullanma Tarihi',
    cvv: 'CVV',
    pay: 'Öde',
    cancel: 'İptal',
    processing: 'İşleniyor...',
    paymentNote: 'Bu hackathon için mock ödeme sistemidir. Gerçek ödeme işlemi yapılmaz.',
    invalidCardNumber: 'Geçersiz kart numarası',
    invalidCardName: 'Lütfen kart sahibi adını girin',
    invalidExpiry: 'Geçersiz son kullanma tarihi',
    invalidCvv: 'Geçersiz CVV',
    dayPassNote: 'Günlük bilet o gün için sınırsız seyahat içerir',
    
    // Ticket History
    ticketHistory: 'Bilet Geçmişi',
    noTickets: 'Kayıtlı bilet yok',
    expired: 'Süresi Dolmuş',
    printTicket: 'Bileti Yazdır',
    shareTicket: 'Bileti Paylaş',
    
    // Discount
    discountCodePlaceholder: 'İndirim kodu girin',
    apply: 'Uygula',
    discountApplied: 'İndirim uygulandı',
    invalidDiscountCode: 'Geçersiz indirim kodu',
    originalPrice: 'Orijinal Fiyat',
    youSave: 'Tasarruf',
  }
}

// Language codes
export const languages = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  tr: 'Türkçe'
}

// Get translation function
export function t(key, lang = 'en') {
  return translations[lang]?.[key] || translations.en[key] || key
}

// Get all translations for a language
export function getTranslations(lang = 'en') {
  return translations[lang] || translations.en
}

export default translations

