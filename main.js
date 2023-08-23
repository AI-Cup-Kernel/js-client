export async function initilizer(game) {}

export async function turn(game) {
  try {
    await game.next_state();
  } catch (err) {
    console.log(err);
  }
}
