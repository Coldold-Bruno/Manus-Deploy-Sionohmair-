/**
 * Test de vérification de la configuration Zoom API
 * Ce fichier sera supprimé après validation
 */

async function testZoomConfig() {
  console.log("🔍 Vérification de la configuration Zoom...\n");

  // Vérifier que les variables d'environnement existent
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    console.error("❌ Erreur : Les secrets Zoom ne sont pas configurés");
    console.log("\nSecrets manquants :");
    if (!accountId) console.log("  - ZOOM_ACCOUNT_ID");
    if (!clientId) console.log("  - ZOOM_CLIENT_ID");
    if (!clientSecret) console.log("  - ZOOM_CLIENT_SECRET");
    console.log("\n💡 Allez dans Settings → Secrets dans l'interface de gestion pour les ajouter.");
    return false;
  }

  console.log("✅ Tous les secrets Zoom sont configurés :");
  console.log(`  - ZOOM_ACCOUNT_ID: ${accountId.substring(0, 10)}...`);
  console.log(`  - ZOOM_CLIENT_ID: ${clientId.substring(0, 10)}...`);
  console.log(`  - ZOOM_CLIENT_SECRET: ${clientSecret.substring(0, 10)}...\n`);

  // Tester l'authentification avec Zoom
  try {
    console.log("🔐 Test d'authentification avec Zoom API...");
    
    const tokenResponse = await fetch("https://zoom.us/oauth/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=account_credentials&account_id=${accountId}`,
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("❌ Erreur d'authentification Zoom :", error);
      return false;
    }

    const tokenData = await tokenResponse.json();
    console.log("✅ Authentification réussie !");
    console.log(`  - Access Token: ${tokenData.access_token.substring(0, 20)}...\n`);

    // Tester la création d'une réunion de test
    console.log("📅 Test de création d'une réunion Zoom...");
    
    const meetingResponse = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: "Test - Session de Coaching Sionohmair",
        type: 2, // Scheduled meeting
        start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Demain
        duration: 60,
        timezone: "Europe/Paris",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: true,
          audio: "both",
          auto_recording: "none",
        },
      }),
    });

    if (!meetingResponse.ok) {
      const error = await meetingResponse.text();
      console.error("❌ Erreur de création de réunion :", error);
      return false;
    }

    const meetingData = await meetingResponse.json();
    console.log("✅ Réunion de test créée avec succès !");
    console.log(`  - Meeting ID: ${meetingData.id}`);
    console.log(`  - Join URL: ${meetingData.join_url}`);
    console.log(`  - Start URL: ${meetingData.start_url.substring(0, 50)}...\n`);

    // Supprimer la réunion de test
    console.log("🗑️  Suppression de la réunion de test...");
    const deleteResponse = await fetch(`https://api.zoom.us/v2/meetings/${meetingData.id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
      },
    });

    if (deleteResponse.ok) {
      console.log("✅ Réunion de test supprimée\n");
    }

    console.log("🎉 Configuration Zoom validée avec succès !");
    console.log("Le système peut maintenant générer automatiquement des liens Zoom.\n");
    
    return true;
  } catch (error) {
    console.error("❌ Erreur lors du test Zoom :", error);
    return false;
  }
}

// Exécuter le test
testZoomConfig().then((success) => {
  process.exit(success ? 0 : 1);
});
