import logging
import logging.config
import os

log_path = "log"
if not os.path.exists(log_path):
    os.mkdir(log_path)

logging.config.fileConfig('storage/logging.conf')


class Logger:

    def __init__(self, *args):
        if args and args[0]:
            self.logger = logging.getLogger(args[0])
        else:
            self.logger = logging.getLogger()

    def info(self, msg):
        self.logger.info(msg=msg)

    def warn(self, msg):
        self.logger.warning(msg=msg)

    def error(self, e):
        logging.exception(e)


if __name__ == '__main__':
    logger = Logger()
    logger.error(Exception("exc"))
    logger.warn("abcd")
