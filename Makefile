run: z_run ## Run stat gathering script
deploy: z_deploy ## Run

RUN_DATE=$(shell date)

z_run: ## ∟ Run backend
	python dir.py

z_deploy: ## ∟ Run deploy
	git diff --exit-code && echo "No changes to data." || (git add -A && it commit -a -m "Automated push of new data by github worklow on $(RUN_DATE)" && git push origin main)