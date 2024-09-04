export async function saveEmailToDatabase(
  email: string,
  name: string,
): Promise<void> {
  try {
    const response = await fetch(`https://www.schola.space/api/add-lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name }),
    });
    if (!response.ok) {
      throw new Error("Error al guardar el email en la base de datos");
    }
    console.log("Email guardado con éxito");
  } catch (error) {
    console.error("Error al guardar el email:", error);
  }
}
