#!/usr/bin/env pwsh
# update-baseline.ps1 - Automated baseline update and test script

Write-Host "Starting automated baseline update flow..." -ForegroundColor Green

# Step 1: Switch to screenshot generation mode
Write-Host "Step 1: Switching to screenshot generation mode..." -ForegroundColor Yellow
$testFile = "tests\playwright-viewport.spec.ts"
$content = Get-Content $testFile -Raw

# Comment out toHaveScreenshot and uncomment page.screenshot
$content = $content -replace '//await page\.screenshot', 'await page.screenshot'
$content = $content -replace 'await expect\(page\)\.toHaveScreenshot', '//await expect(page).toHaveScreenshot'

Set-Content $testFile $content
Write-Host "Test switched to screenshot generation mode" -ForegroundColor Green

# Step 2: Generate new screenshots
Write-Host "Step 2: Generating new screenshots..." -ForegroundColor Yellow
try {
    npx playwright test tests/playwright-viewport.spec.ts
    Write-Host "Screenshots generated successfully" -ForegroundColor Green
}
catch {
    Write-Host "Tests may have failed, but screenshots should be generated" -ForegroundColor DarkYellow
}

# Step 3: Copy and rename screenshots to baseline folder
Write-Host "Step 3: Copying screenshots to baseline folder..." -ForegroundColor Yellow

# Clear existing baseline folder
if (Test-Path "tests\playwright-viewport.spec.ts-snapshots") {
    Remove-Item "tests\playwright-viewport.spec.ts-snapshots\*" -Force -ErrorAction SilentlyContinue
}

# Copy screenshots with proper naming
Get-ChildItem screenshots -Recurse -File | ForEach-Object { 
    $newName = ($_.Directory.Name + '-' + $_.BaseName + $_.Extension).Replace(' ', '-').Replace('.png', '-win32.png')
    Copy-Item $_.FullName -Destination ('tests\playwright-viewport.spec.ts-snapshots\' + $newName) -Force 
}

$fileCount = (Get-ChildItem "tests\playwright-viewport.spec.ts-snapshots\*.png").Count
Write-Host "Copied $fileCount screenshots to baseline folder" -ForegroundColor Green

# Step 4: Switch back to visual regression mode
Write-Host "Step 4: Switching back to visual regression mode..." -ForegroundColor Yellow
$content = Get-Content $testFile -Raw

# Comment out page.screenshot and uncomment toHaveScreenshot
$content = $content -replace 'await page\.screenshot', '//await page.screenshot'
$content = $content -replace '//await expect\(page\)\.toHaveScreenshot', 'await expect(page).toHaveScreenshot'

Set-Content $testFile $content
Write-Host "Test switched back to visual regression mode" -ForegroundColor Green

# Step 5: Run visual regression tests
Write-Host "Step 5: Running visual regression tests..." -ForegroundColor Yellow
try {
    npx playwright test tests/playwright-viewport.spec.ts
    Write-Host "All tests passed! Baseline updated successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Visual regression tests failed. Check the diff images in test-results folder." -ForegroundColor Red
    Write-Host "You may need to run this script again or manually fix issues." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Automated baseline update flow completed!" -ForegroundColor Green
Write-Host "Check test results and screenshots in the baseline folder." -ForegroundColor Cyan 