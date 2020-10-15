# from notebook.auth import passwd
# passwd('as123456')

c.JupyterApp.generate_config = False
c.NotebookApp.allow_origin = '*'
c.NotebookApp.allow_remote_access = True
c.NotebookApp.allow_root = True
c.NotebookApp.default_url = '/lab'
c.NotebookApp.shutdown_no_activity_timeout = 10
c.NotebookApp.tornado_settings = {
    'headers': {
        'Content-Security-Policy': "frame-ancestors self *; report-uri ./api/security/csp-report",
    }
}