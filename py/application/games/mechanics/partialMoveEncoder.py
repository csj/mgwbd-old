import jwt


class PartialMoveEncoder(object):
  secret = 'pmemgwbd'

  def encode(self, decodedValue):
    return jwt.encode(decodedValue, self.secret).decode('utf-8')

  def decode(self, encodedValue):
    return jwt.decode(encodedValue, self.secret)
