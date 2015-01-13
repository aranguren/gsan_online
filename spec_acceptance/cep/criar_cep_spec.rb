require "rails_helper"

describe "Como um cadastrista", type: :feature, js: true do
  it "eu posso cadastrar CEPs" do
    visit root_path

    click_link "CEPs"
    click_link "Criar CEP"
    cadastrar_cep

    expect(page).to have_content "CEP criado com sucesso"

    expect(page).to have_content "66050380"
    expect(page).to have_content "ÚNICO"
    expect(page).to have_content "BELÉM"
    expect(page).to have_content "UMARIZAL"
    expect(page).to have_content "RUA"
    expect(page).to have_content "PA"
    expect(page).to have_content "OLIVEIRA-BELO"
    expect(page).to have_css ".cep_ativo", text: "Sim"
  end
end
