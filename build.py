#!env/bin/python
import shutil
from subprocess import run


def copyDir(src: str, dst: str):
    shutil.rmtree(dst, ignore_errors=True)
    shutil.copytree(src, dst)


run(['npm', 'run', 'build'], cwd='src/client')
copyDir('src/client/build', 'deploy/client')
copyDir('src/server', 'deploy/server')
