#!env/bin/python
from enum import Enum, auto
import shutil
import argparse
from subprocess import run


class Actions(Enum):
    build = auto()
    serve = auto()


parser = argparse.ArgumentParser(description='Build project')
parser.add_argument('action',
                    nargs='?',
                    choices=Actions._member_names_,
                    default='build',
                    help='action to preform (default: build)')

args = parser.parse_args()


def copyDir(src: str, dst: str):
    shutil.rmtree(dst, ignore_errors=True)
    shutil.copytree(src, dst)


def build():
    run(['npm', 'run', 'build'], cwd='client')
    copyDir('client/build', 'deploy/client')
    copyDir('server', 'deploy/server')


def serve():
    run(['flask', '--debug', 'run'], cwd='server')


if args.action == Actions.build.name:
    print('building')
    build()
elif args.action == Actions.serve.name:
    print('serving')
    serve()
