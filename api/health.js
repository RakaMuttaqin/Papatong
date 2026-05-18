export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    app: 'Papatong',
    version: '1.0.0'
  });
}
