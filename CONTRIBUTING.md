# Contributing

## Toolbox Debugging

1. In `pnpm-workspace.yml`, add:
```yaml
packages:
  - toolbox/packages/*
```

2. In `docker-compose.dev.yml`, add in all containers:
```yaml
volumes:
  - ../toolbox:/workspace/toolbox
```

3. In app `package.json` replace the toolbox package version:
```yaml
"@setsetset-777/payloader": "file:../toolbox/packages/payloader",
```
