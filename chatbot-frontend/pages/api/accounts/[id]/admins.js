// returns Facebook‐page admins for account
export default async function handler(req, res) {
  const { id } = req.query;
  // TODO: verify user has access to account
  const admins = await fetchPageAdmins(id); 
  // returns [{ name, email, avatar }]
  res.status(200).json(admins);
}
