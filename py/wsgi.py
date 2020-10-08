from application import create_app

application = create_app()

if __name__ == '__main__':
  # Use this line for testing oauth locally.
  # application.run(ssl_context='adhoc')
  application.run()

