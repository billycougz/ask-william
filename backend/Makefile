PACKAGE_NAME := package.zip
SRC_DIR := src
STAGING_DIR := staging

clean:
	@echo "Cleaning up..."
	@rm -rf $(PACKAGE_NAME) $(STAGING_DIR)

install_dev:
	@echo "Installing dependencies..."
	@pip install -r requirements.txt -r requirements-dev.txt

install_package: clean
	@echo "Installing dependencies..."
	@pip install --target $(STAGING_DIR) -r requirements.txt

package: install_package
	@echo "Packaging..."
	@mkdir -p $(STAGING_DIR)
	@cp -r $(SRC_DIR)/* $(STAGING_DIR)/
	@cd $(STAGING_DIR) && zip -r ../$(PACKAGE_NAME) .
	@rm -rf $(STAGING_DIR)

run:
	python local.py

.PHONY: clean install_dev install_package package run
