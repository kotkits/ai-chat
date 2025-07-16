// returns connected accounts
export default async function handler(req, res) {
  // TODO: authenticate user, then fetch from DB
  const accounts = await getUserAccounts(req.user.id);
  res.status(200).json(accounts);
}
